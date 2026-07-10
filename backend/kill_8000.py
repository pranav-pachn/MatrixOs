import os
import subprocess
import re

def kill_port(port):
    try:
        output = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode()
        pids = set()
        for line in output.split('\n'):
            if 'LISTENING' in line:
                parts = line.strip().split()
                pid = parts[-1]
                pids.add(pid)
        for pid in pids:
            if pid != '0':
                print(f"Killing PID {pid}")
                os.system(f"taskkill /F /T /PID {pid}")
    except Exception as e:
        print(f"Error: {e}")

kill_port(8000)
