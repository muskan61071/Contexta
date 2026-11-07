def alternatives_for_attachment(noun:str)->list[dict]:
    return [
        {'meaning':f'The speaker used the {noun} to see the person.','confidence':50,'support':[],'conflict':[]},
        {'meaning':f'The person had the {noun}.','confidence':50,'support':[],'conflict':[]},
    ]
