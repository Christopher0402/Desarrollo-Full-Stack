from flask import Flask, request, jsonify
import json
import bcrypt
import jwt
from functools import wraps

app = Flask(__name__)
SECRET = "clave_secreta"

# ================= FILES =================

def leer(nombre):
    try:
        with open(nombre, "r") as f:
            return json.load(f)
    except:
        return []

def guardar(nombre, data):
    with open(nombre, "w") as f:
        json.dump(data, f, indent=2)

# ================= AUTH =================

def auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"mensaje":"Token requerido"}),401

        try:
            jwt.decode(token, SECRET, algorithms=["HS256"])
        except:
            return jsonify({"mensaje":"Token inválido"}),403

        return f(*args, **kwargs)
    return wrapper

# ================= REGISTER =================

@app.route("/register", methods=["POST"])
def register():
    usuarios = leer("usuarios.json")
    data = request.json

    hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

    usuarios.append({
        "usuario": data["usuario"],
        "password": hashed.decode()
    })

    guardar("usuarios.json", usuarios)
    return jsonify({"mensaje":"Usuario registrado"})

# ================= LOGIN =================

@app.route("/login", methods=["POST"])
def login():
    usuarios = leer("usuarios.json")
    data = request.json

    user = next((u for u in usuarios if u["usuario"] == data["usuario"]), None)

    if not user:
        return jsonify({"mensaje":"No existe"}),400

    if not bcrypt.checkpw(data["password"].encode(), user["password"].encode()):
        return jsonify({"mensaje":"Password incorrecto"}),400

    token = jwt.encode({"usuario": user["usuario"]}, SECRET, algorithm="HS256")

    return jsonify({"token":token})

# ================= CRUD =================

@app.route("/tareas", methods=["GET"])
@auth
def get_tareas():
    return jsonify(leer("tareas.json"))

@app.route("/tareas", methods=["POST"])
@auth
def crear():
    tareas = leer("tareas.json")
    data = request.json

    nueva = {
        "id": len(tareas)+1,
        "titulo": data["titulo"],
        "descripcion": data["descripcion"]
    }

    tareas.append(nueva)
    guardar("tareas.json", tareas)
    return jsonify(nueva)

@app.route("/tareas/<int:id>", methods=["PUT"])
@auth
def actualizar(id):
    tareas = leer("tareas.json")
    data = request.json

    for t in tareas:
        if t["id"] == id:
            t["titulo"] = data["titulo"]
            t["descripcion"] = data["descripcion"]
            guardar("tareas.json", tareas)
            return jsonify(t)

    return jsonify({"mensaje":"No encontrada"}),404

@app.route("/tareas/<int:id>", methods=["DELETE"])
@auth
def borrar(id):
    tareas = leer("tareas.json")
    tareas = [t for t in tareas if t["id"] != id]
    guardar("tareas.json", tareas)
    return jsonify({"mensaje":"Eliminada"})

# ================= RUN =================

if __name__ == "__main__":
    app.run(debug=True, port=3000)
