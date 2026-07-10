import json
import os
import re

def update_mock_missions(mock_file, json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)
        
    missions_json = json.dumps(data['missions'], indent=4)
    # Convert some python json to TS (like null to null, etc... wait json.dumps outputs valid JS except we might want to drop quotes from keys, but it's valid JS anyway)
    # Let's replace the `missions: [...]` block in the TS file.
    
    with open(mock_file, 'r') as f:
        content = f.read()
        
    # Regex to find `missions: [\s\S]*?],\n  resources:`
    pattern = r'missions:\s*\[[\s\S]*?\],\n  resources:'
    replacement = f'missions: {missions_json},\n  resources:'
    
    new_content = re.sub(pattern, replacement, content)
    
    with open(mock_file, 'w') as f:
        f.write(new_content)
        
update_mock_missions('frontend/src/lib/mock/hospital.ts', 'backend/data/hospital-er.json')
update_mock_missions('frontend/src/lib/mock/warehouse.ts', 'backend/data/warehouse-hub.json')
print("Mocks updated.")
