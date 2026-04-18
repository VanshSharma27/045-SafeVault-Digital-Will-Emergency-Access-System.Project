# migrations/0001_initial.py
# Auto-generated migration for Product model
# Project: ShopEasy | Author: Vansh Sharma

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('price', models.DecimalField(decimal_places=2, max_digits=8)),
                ('description', models.TextField()),
                ('category', models.CharField(
                    choices=[
                        ('electronics', 'Electronics'),
                        ('clothing', 'Clothing'),
                        ('accessories', 'Accessories'),
                        ('home', 'Home & Kitchen'),
                        ('footwear', 'Footwear'),
                        ('bags', 'Bags'),
                    ],
                    default='electronics',
                    max_length=50
                )),
                ('emoji', models.CharField(default='📦', max_length=10)),
                ('is_available', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
                'ordering': ['name'],
            },
        ),
    ]
