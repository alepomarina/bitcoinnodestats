# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-05-12 18:18
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nodedata', '0009_rawnodedata_node_up'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='peer',
            name='peer_json',
        ),
    ]
