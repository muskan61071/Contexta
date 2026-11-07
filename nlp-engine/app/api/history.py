import json
from fastapi import APIRouter,HTTPException
from ..database.connection import connect
router=APIRouter(prefix='/api/history')
@router.get('')
def history():
    con=connect();rows=con.execute('SELECT payload FROM analyses ORDER BY created_at DESC LIMIT 500').fetchall();con.close()
    return [json.loads(row[0]) for row in rows]
@router.delete('/{analysis_id}')
def delete(analysis_id:str):
    con=connect();cursor=con.execute('DELETE FROM analyses WHERE id=?',(analysis_id,));con.commit();con.close()
    if cursor.rowcount==0:raise HTTPException(404,'Analysis not found.')
    return {'deleted':True}
@router.delete('')
def clear():
    con=connect();con.execute('DELETE FROM analyses');con.commit();con.close();return {'deleted':True}
