import json

with open('public/data/colombia.geo.json', 'r') as f:
    data = json.load(f)
    
features = data['features']
department_list = []
for feature in features:
    props = feature['properties']
    department_list.append({'shapeID': props['shapeID'], 'name': props['shapeName']})

print(json.dumps(department_list, indent=2))
