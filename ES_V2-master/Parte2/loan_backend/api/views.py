from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import LoanRequest
from datetime import datetime
import boto3
import base64
import os

# Simulação de Empréstimo
class LoanSimulationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Obtenção dos dados do cliente
            amount = float(request.data.get("amount", 0))
            duration = int(request.data.get("duration", 0))
            salary = float(request.data.get("salary", 0))
            expenses = float(request.data.get("expenses", 0))

            # Validações básicas
            if not amount or not duration or not salary or not expenses:
                return Response(
                    {"error": "Dados incompletos. Certifique-se de preencher todos os campos."},
                    status=400
                )

            if amount <= 0 or duration <= 0 or salary <= 0 or expenses < 0:
                return Response(
                    {"error": "Valores inválidos. Todos os valores devem ser maiores que zero, exceto despesas."},
                    status=400
                )

            # Calcula o salário disponível
            disposable_income = salary - expenses
            
            # Calcula a parcela mensal do empréstimo
            monthly_payment = amount / duration

            # Lógica da simulação
            if monthly_payment <= disposable_income * 0.30:
                result = "Aprovado"
            elif monthly_payment <= disposable_income * 0.75:
                result = "Marcação de Entrevista"
            elif monthly_payment <= disposable_income * 1.00:
                result = "Reprovado"
            else:
                result = "Erro! Tente Novamente com outros dados!"

            #print(f"Disposable Income: {disposable_income}")
            #print(f"Monthly Payment: {monthly_payment}")
            #print(f"Monthly Payment <= 30%: {monthly_payment <= disposable_income * 0.30}")
            #print(f"Monthly Payment <= 50%: {monthly_payment <= disposable_income * 0.75}")
            #print(f"Monthly Payment <= 100%: {monthly_payment <= disposable_income * 0.90}")


            # Devolver o resultado com detalhes
            return Response({
                "result": result,
                "amount": amount,
                "duration": duration,
                "monthly_payment": monthly_payment,
                "disposable_income": disposable_income
            })

        except ValueError:
            return Response(
                {"error": "Formato inválido. 'amount', 'duration', 'salary' e 'expenses' devem ser numéricos."},
                status=400
            )


class FaceRecognitionView(APIView):
    def post(self, request):
        image_data = request.data.get("image")
        if not image_data:
            return Response({"error": "No image provided"}, status=400)

        # Decodificar a imagem base64
        image_bytes = base64.b64decode(image_data)

        # Configuração do cliente Rekognition
        client = boto3.client('rekognition', region_name='us-west-2')
        response = client.search_faces_by_image(
            CollectionId='users_faces',
            Image={'Bytes': image_bytes},
            MaxFaces=1,
            FaceMatchThreshold=90
        )

        if response['FaceMatches']:
            # Obter o ID do utilizador associado à face
            user_id = response['FaceMatches'][0]['Face']['ExternalImageId']
            return Response({"message": "Face recognized", "user_id": user_id}, status=200)
        else:
            return Response({"error": "Face not recognized"}, status=401)


# Submissão de Pedido de Empréstimo
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_loan_request(request):
    user = request.user
    amount = request.data.get("amount")
    duration = request.data.get("duration")

    if not amount or not duration:
        return Response({"error": "Dados incompletos."}, status=400)

    try:
        # Criar o pedido de empréstimo
        loan = LoanRequest.objects.create(
            user=user,
            amount=amount,
            duration_months=duration,
            status="pending"
        )
        return Response(
            {
                "loanId": loan.id,
                "message": f"Pedido submetido com sucesso! ID: {loan.id}"
            },
            status=201
        )
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# Consulta do Status do Pedido de Empréstimo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_loan_status(request, loan_id):
    loan = get_object_or_404(LoanRequest, id=loan_id, user=request.user)
    return Response({
        "loanId": loan.id,
        "amount": loan.amount,
        "duration": loan.duration_months,
        "status": loan.status,
        "created_at": loan.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        "updated_at": loan.updated_at.strftime('%Y-%m-%d %H:%M:%S')
    })

class FaceLoginAPIView(APIView):
    def post(self, request):
        image_data = request.data.get("image")
        if not image_data:
            return Response({"error": "No image provided"}, status=400)

        # Decodificar a imagem base64
        image_bytes = base64.b64decode(image_data)

        # Configuração do cliente Rekognition
        client = boto3.client('rekognition', region_name='us-west-2')
        response = client.search_faces_by_image(
            CollectionId='users_faces',
            Image={'Bytes': image_bytes},
            MaxFaces=1,
            FaceMatchThreshold=90
        )

        if response['FaceMatches']:
            # Obter o ID do utilizador associado à face
            user_id = response['FaceMatches'][0]['Face']['ExternalImageId']
            try:
                user = User.objects.get(id=user_id)
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Authenticated successfully.",
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                })
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=404)
        else:
            return Response({"error": "Face not recognized."}, status=401)
        

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_document(request):
    try:
        # Recebe o ID do pedido de empréstimo e o arquivo
        loan_id = request.data.get('loan_id')
        file = request.FILES.get('file')

        # Validação do ID
        if not loan_id:
            return Response({"error": "ID do pedido não fornecido."}, status=400)

        # Verificar se o pedido existe para o usuário autenticado
        loan_request = get_object_or_404(LoanRequest, id=loan_id, user=request.user)

        if not file:
            return Response({"error": "Nenhum arquivo enviado."}, status=400)

        # Criar diretório baseado no ID
        upload_dir = os.path.join('uploads', str("ID "+loan_id))
        os.makedirs(upload_dir, exist_ok=True)

        # Caminho final para salvar o arquivo
        file_path = os.path.join(upload_dir, file.name)

        # Salvar o arquivo
        with open(file_path, 'wb') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        return Response({"message": "Documento enviado com sucesso!", "file_path": file_path})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

#novo
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_loan_ids(request):
    loans = LoanRequest.objects.filter(user=request.user).values('id')
    loan_ids = [loan['id'] for loan in loans]
    return Response({"loan_ids": loan_ids})