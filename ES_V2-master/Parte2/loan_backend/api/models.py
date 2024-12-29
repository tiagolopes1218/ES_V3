from django.db import models
from django.contrib.auth.models import User

class LoanRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('interview', 'Interview Required'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loan_requests')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    duration_months = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"LoanRequest(user={self.user.username}, amount={self.amount}, status={self.status})"
    
class UploadedDocument(models.Model):
    loan_request = models.ForeignKey('LoanRequest', on_delete=models.CASCADE, related_name='documents')
    file_path = models.CharField(max_length=255)
    caption = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.caption or 'Sem legenda'} ({self.file_path})"