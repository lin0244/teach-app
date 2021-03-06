from rest_framework.serializers import (
	IntegerField,
	FloatField,
	HyperlinkedIdentityField,
	HyperlinkedModelSerializer,
	HyperlinkedRelatedField,
	ModelSerializer, 
	PrimaryKeyRelatedField, 
	SerializerMethodField
	)

from alumnes.serializers import AlumneListSerializer

from .models import Nota, Prova


# Nota
# ------------------------------------------------------------------------

class NotaCreateUpdateSerializer(ModelSerializer):
	class Meta:
		model = Nota
		fields = [
			'nota',
			'alumne',
			'prova'
		]


class NotaListSerializer(ModelSerializer):

	url_detail =  HyperlinkedIdentityField(view_name='proves-api:nota-detail', lookup_field='pk')
	# alumne = AlumneListSerializer(many=False)

	class Meta:
		model = Nota
		fields = [
			'nota',
			'alumne',
			'url_detail',
			'prova'
		]


class NotaDetailSerializer(ModelSerializer):

	url_detail =  HyperlinkedIdentityField(view_name='proves-api:nota-detail', lookup_field='pk')
	alumne = AlumneListSerializer(many=False)

	class Meta:
		model = Nota
		fields = [
			'nota',
			'alumne',
			'url_detail',
			'prova'
		]


# Prova
# ------------------------------------------------------------------------

class ProvaCreateUpdateSerializer(ModelSerializer):
	class Meta:
		model = Prova
		fields = [
			'id',
			'nom',
			'data',
			'continguts',
			'nota_total',
			'pes_total',
			'assignatura'
		]


class ProvaListSerializer(ModelSerializer):

	notes_count = IntegerField(
		source='notes_prova.count', 
		read_only=True
	)

	# notes_prova = HyperlinkedRelatedField(many=True, view_name='proves-api:nota-detail', read_only=True) # Hyperlinked Identity Field
	url_detail =  HyperlinkedIdentityField(view_name='proves-api:prova-detail', lookup_field='pk')
	notes_prova = NotaListSerializer(many=True)
	assignatura = PrimaryKeyRelatedField(read_only=True)

	class Meta:
		model = Prova
		fields = [
			'id',
			'nom',
			'data',
			'nota_total',
			'notes_count',
			'notes_prova',
			'assignatura',
			'pes_total',
			'url_detail'
		]


class ProvaDetailSerializer(ModelSerializer):

	notes_count = IntegerField(
		source='notes_prova.count', 
		read_only=True
	)

	# notes_prova = HyperlinkedRelatedField(many=True, view_name='proves-api:nota-detail', read_only=True) # Hyperlinked Identity Field

	notes_prova = NotaDetailSerializer(many=True)
	assignatura = PrimaryKeyRelatedField(read_only=True)

	class Meta:
		model = Prova
		fields = [
			'id',
			'nom',
			'data',
			'nota_total',
			'notes_count',
			'notes_prova',
			'pes_total',
			'assignatura',
			'continguts',
		]