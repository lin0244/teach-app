# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-12-10 19:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assignatures', '0010_remove_assignatura_curs'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='avaluacio',
            name='num',
        ),
        migrations.AddField(
            model_name='avaluacio',
            name='nom',
            field=models.CharField(default=1, max_length=120),
            preserve_default=False,
        ),
    ]