from rest_framework import serializers
from .models import LoanRequest
from django.contrib.auth.models import User

class LoanRequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Exibe o nome de usuário em vez do ID

    class Meta:
        model = LoanRequest
        fields = ['id', 'user', 'amount', 'duration_months', 'status', 'created_at', 'updated_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
