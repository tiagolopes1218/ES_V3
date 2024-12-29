"""from django.contrib import admin

# Register your models here.
"""

from django.contrib import admin
from .models import LoanRequest

@admin.register(LoanRequest)
class LoanRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'duration_months', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('user__username', 'amount')
    ordering = ('-created_at',)
