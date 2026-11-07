from app.main import AnalyzeRequest, relationship_extract

def test_action_and_roles_are_extracted():
    roles=relationship_extract("Rahul sent Priya the project report")
    values={x["role"]:x["value"] for x in roles}
    assert values["Action"]=="sent"
    assert values["Person / entity"]=="Rahul"
    assert "Object" in values
