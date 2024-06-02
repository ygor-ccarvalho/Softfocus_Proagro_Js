from typing import Union

from fastapi import FastAPI

from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

from haversine import haversine

import psycopg2

from psycopg2.extras import RealDictCursor

connection = psycopg2.connect(user="postgres",
                              password="postgres",
                              host="127.0.0.1",
                              port="5432",
                              database="softfocus")

cursor = connection.cursor(cursor_factory=RealDictCursor)

app = FastAPI()


class LossCommunication(BaseModel):
    nome: str
    email: str
    cpf: str
    latitude: float
    longitude: float
    tipo_lavoura: str
    data_colheita: str
    evento_ocorrido: str


origins = [
    "http://127.0.0.1",
    "http://localhost",
    "http://localhost:4200",
    "http://localhost:8000",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/comunicacoes")
def read_all():
    cursor.execute("SELECT * FROM comunicacao_perda;")
    return cursor.fetchall()


@app.post("/comunicacoes")
def create_item(data: LossCommunication):
    jaExiste = False
    cursor.execute("SELECT * FROM comunicacao_perda WHERE data_colheita = %s", (data.data_colheita,))
    comunicacoes = cursor.fetchall()
    for comunicacao in comunicacoes:
            distancia = haversine((data.latitude, data.longitude), (comunicacao.get('latitude'), comunicacao.get('longitude')))
            if(distancia < 10):
                jaExiste = True
    if(jaExiste):
        return 'Ja existe'
    else:
        cursor.execute("INSERT INTO comunicacao_perda (nome, email, cpf, latitude, longitude, tipo_lavoura, data_colheita, evento_ocorrido) VALUES(%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                   (data.nome, data.email, data.cpf, data.latitude, data.longitude, data.tipo_lavoura, data.data_colheita, data.evento_ocorrido))
        connection.commit()
        return cursor.fetchone()

@app.get("/comunicacoes/{cpf}")
def read_item(cpf: str):
    cursor.execute("SELECT * FROM comunicacao_perda WHERE cpf = %s", (cpf,))
    return cursor.fetchall()
    

@app.delete("/comunicacoes/{id}")
def delete_item(id: int):
    cursor.execute("SELECT * FROM comunicacao_perda WHERE id = %s", (id,))
    data = cursor.fetchall()
    if(data):
        cursor.execute("DELETE FROM comunicacao_perda WHERE id = %s", (id,))
        connection.commit()
        return 'Deletado com sucesso'
    else:
        return 'Item não encontrado'

@app.put("/comunicacoes/{id}")
def update_item(id:str, data: LossCommunication):
    cursor.execute("UPDATE comunicacao_perda SET nome=%s, email=%s, cpf=%s, latitude=%s, longitude=%s, tipo_lavoura=%s, data_colheita=%s, evento_ocorrido=%s WHERE id=%s RETURNING id",
                   (data.nome, data.email, data.cpf, data.latitude, data.longitude, data.tipo_lavoura, data.data_colheita, data.evento_ocorrido, id))
    connection.commit()
    return cursor.fetchall()
