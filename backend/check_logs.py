import sqlite3

conn = sqlite3.connect("ensina_logica.db")
rows = conn.execute(
    """
    SELECT id, topic, level, source, created_at
    FROM explanation_logs
    ORDER BY id DESC;
    """
).fetchall()

for row in rows:
    print(row)

conn.close()