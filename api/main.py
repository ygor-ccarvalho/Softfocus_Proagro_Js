from typing import List, Optional

from fastapi import FastAPI, HTTPException

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

@app.get("/comunicacoes", response_model=List[LossCommunication])
def read_all():
    cursor.execute("SELECT * FROM comunicacao_perda;")
    return cursor.fetchall()


@app.post("/comunicacoes", response_model=LossCommunication)
def create_item(data: LossCommunication):
    jaExiste = False
    cursor.execute("SELECT * FROM comunicacao_perda WHERE data_colheita = %s", (data.data_colheita,))
    comunicacoes = cursor.fetchall()
    for comunicacao in comunicacoes:
        distancia = haversine((data.latitude, data.longitude), (comunicacao['latitude'], comunicacao['longitude']))
        if distancia < 10:
            jaExiste = True
            break
    if jaExiste:
        raise HTTPException(status_code=400, detail="Comunicação já existe em um raio de 10 km para a mesma data de colheita.")
    cursor.execute(
        "INSERT INTO comunicacao_perda (nome, email, cpf, latitude, longitude, tipo_lavoura, data_colheita, evento_ocorrido) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING *",
        (data.nome, data.email, data.cpf, data.latitude, data.longitude, data.tipo_lavoura, data.data_colheita, data.evento_ocorrido)
    )
    connection.commit()
    return cursor.fetchone()

@app.get("/comunicacoes/{cpf}", response_model=List[LossCommunication])
def read_item(cpf: str):
    cursor.execute("SELECT * FROM comunicacao_perda WHERE cpf = %s", (cpf,))
    results = cursor.fetchall()
    if not results:
        raise HTTPException(status_code=404, detail="Comunicação não encontrada")
    return results
@app.delete("/comunicacoes/{id}", response_model=dict)
def delete_item(id: int):
    cursor.execute("SELECT * FROM comunicacao_perda WHERE id = %s", (id,))
    data = cursor.fetchone()
    if data:
        cursor.execute("DELETE FROM comunicacao_perda WHERE id = %s", (id,))
        connection.commit()
        return {"message": "Deletado com sucesso"}
    else:
        raise HTTPException(status_code=404, detail="Item não encontrado")

@app.put("/comunicacoes/{id}", response_model=LossCommunication)
def update_item(id: int, data: LossCommunication):
    cursor.execute(
        "UPDATE comunicacao_perda SET nome=%s, email=%s, cpf=%s, latitude=%s, longitude=%s, tipo_lavoura=%s, data_colheita=%s, evento_ocorrido=%s WHERE id=%s RETURNING *",
        (data.nome, data.email, data.cpf, data.latitude, data.longitude, data.tipo_lavoura, data.data_colheita, data.evento_ocorrido, id)
    )
    updated_data = cursor.fetchone()
    if updated_data:
        connection.commit()
        return updated_data
    else:
        raise HTTPException(status_code=404, detail="Item não encontrado")