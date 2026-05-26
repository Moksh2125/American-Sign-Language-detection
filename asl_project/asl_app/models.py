from django.db import models

class ASLSign(models.Model):
    CATEGORY_CHOICES = [
        ('alphabet', 'Alphabet'),
        ('numbers', 'Numbers'),
        ('common', 'Common Words'),
    ]
    
    label = models.CharField(max_length=100, help_text="Sign name (e.g., 'A', 'Hello', '1')")
    image = models.ImageField(upload_to='asl_signs/', help_text="Upload ASL sign image")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    # description = models.TextField(help_text="Description of the sign")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['category', 'label']
    
    def __str__(self):
        return f"{self.label} ({self.category})"