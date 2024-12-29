from django.contrib import admin
from django.urls import path
from api.views import FaceRecognitionView
from api.views import FaceLoginAPIView
from api import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/simulate/', views.LoanSimulationView.as_view(), name='simulate'),
    path('api/loans/', views.submit_loan_request, name='submit-loan'),  # Submissão do pedido
    path('api/loans/<int:loan_id>/status/', views.check_loan_status, name='check-loan-status'),  # Status do pedido
    path('recognize-face/', FaceRecognitionView.as_view(), name='recognize-face'), #Reconhecimento facial
    path('face-login/', FaceLoginAPIView.as_view(), name='face-login'),
    path('api/upload/', views.upload_document, name='upload-document'),
    path('api/loans/ids/', views.list_loan_ids, name='list-loan-ids'),
]
