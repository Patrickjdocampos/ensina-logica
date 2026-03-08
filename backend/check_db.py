import sqlite3

conn = sqlite3.connect("ensina_logica.db")
tables = conn.execute(
    "SELECT name FROM sqlite_master WHERE type='table';"
).fetchall()

print(tables)
conn.close()