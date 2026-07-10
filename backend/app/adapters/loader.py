from app.adapters.registry import register
from app.adapters.airport.adapter import AirportAdapter
from app.adapters.hospital.adapter import HospitalAdapter
from app.adapters.warehouse.adapter import WarehouseAdapter

def load_all_adapters():
    """
    Called once during startup to load and register all domain adapters.
    This is the ONLY file that is allowed to import concrete adapters.
    """
    register("airport", AirportAdapter())
    register("hospital-er", HospitalAdapter())
    register("warehouse-hub", WarehouseAdapter())
