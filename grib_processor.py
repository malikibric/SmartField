"""
GRIB2 Procesor - Ekstrakcija meteoroloških podataka za poljoprivredu
"""

import os
import sys

def check_dependencies():
    """Provjerava da li su instalirane potrebne biblioteke"""
    missing = []
    
    try:
        import pygrib
        print("✅ pygrib instaliran")
    except ImportError:
        try:
            import cfgrib
            import xarray
            print("✅ cfgrib + xarray instalirani")
        except ImportError:
            missing.append("pygrib ILI (cfgrib + xarray)")
    
    try:
        import numpy
        print("✅ numpy instaliran")
    except ImportError:
        missing.append("numpy")
    
    try:
        import pandas
        print("✅ pandas instaliran")
    except ImportError:
        missing.append("pandas")
    
    if missing:
        print("\n❌ Nedostaju biblioteke:")
        for lib in missing:
            print(f"   - {lib}")
        print("\n📥 Instaliraj sa:")
        print("   pip install pygrib numpy pandas")
        print("   ILI")
        print("   pip install cfgrib xarray numpy pandas")
        return False
    
    return True


def process_grib_with_pygrib(grib_file, lat, lon):
    """
    Obrađuje GRIB2 fajl koristeći pygrib
    
    Args:
        grib_file: Putanja do GRIB2 fajla
        lat: Geografska širina farme
        lon: Geografska dužina farme
    """
    import pygrib
    import numpy as np
    import pandas as pd
    
    print(f"\n📂 Otvaram GRIB fajl: {grib_file}")
    print(f"📍 Lokacija: ({lat}, {lon})")
    
    try:
        grbs = pygrib.open(grib_file)
        
        # ============================================================
        # 1. PREGLED SVIH DOSTUPNIH VARIJABLI
        # ============================================================
        print("\n" + "="*70)
        print("📊 DOSTUPNE METEOROLOŠKE VARIJABLE")
        print("="*70)
        
        variables = []
        grbs.seek(0)
        for i, grb in enumerate(grbs, 1):
            var_info = {
                'index': i,
                'name': grb.name,
                'level': grb.level if hasattr(grb, 'level') else 'N/A',
                'units': grb.units if hasattr(grb, 'units') else 'N/A',
                'shortName': grb.shortName if hasattr(grb, 'shortName') else 'N/A'
            }
            variables.append(var_info)
            
            if i <= 20:  # Prikaži prvih 20
                print(f"{i:3d}. {grb.name:40s} [{grb.units:15s}] Level: {var_info['level']}")
        
        if len(variables) > 20:
            print(f"... i još {len(variables) - 20} varijabli")
        
        print(f"\n💡 Ukupno varijabli: {len(variables)}")
        
        # ============================================================
        # 2. EKSTRAKCIJA VARIJABLI VAŽNIH ZA POLJOPRIVREDU
        # ============================================================
        print("\n" + "="*70)
        print("🌾 EKSTRAKCIJA PODATAKA ZA POLJOPRIVREDU")
        print("="*70)
        
        farm_data = {}
        
        # Definiši varijable koje tražimo
        target_variables = {
            '2 metre temperature': 'temperatura_2m',
            'Total Precipitation': 'padavine',
            '2 metre relative humidity': 'vlaznost',
            '10 metre U wind component': 'vjetar_u',
            '10 metre V wind component': 'vjetar_v',
            'Surface pressure': 'pritisak',
            'Total cloud cover': 'oblacnost',
            'Soil temperature': 'temp_tla',
            'Volumetric soil moisture': 'vlaznost_tla',
            'Downward short-wave radiation flux': 'solarna_radijacija'
        }
        
        # Probaj pronaći i ekstraktovati svaku varijablu
        for var_name, key in target_variables.items():
            grbs.seek(0)
            try:
                # Pronađi varijablu
                selected = grbs.select(name=var_name)
                if selected:
                    grb = selected[0]
                    
                    # Ekstrakcija podataka za određenu lokaciju
                    # Uzmi podatke u radijusu od 0.5° oko lokacije
                    data, lats, lons = grb.data(
                        lat1=lat-0.5, lat2=lat+0.5,
                        lon1=lon-0.5, lon2=lon+0.5
                    )
                    
                    # Pronađi najbližu tačku
                    lat_idx = np.argmin(np.abs(lats[:, 0] - lat))
                    lon_idx = np.argmin(np.abs(lons[0, :] - lon))
                    value = data[lat_idx, lon_idx]
                    
                    # Konverzije jedinica
                    if 'temperature' in var_name.lower():
                        value = value - 273.15  # Kelvin to Celsius
                        unit = '°C'
                    elif 'precipitation' in var_name.lower():
                        unit = 'kg/m²'
                    elif 'humidity' in var_name.lower():
                        unit = '%'
                    elif 'wind' in var_name.lower():
                        unit = 'm/s'
                    elif 'pressure' in var_name.lower():
                        value = value / 100  # Pa to hPa
                        unit = 'hPa'
                    elif 'radiation' in var_name.lower():
                        unit = 'W/m²'
                    elif 'moisture' in var_name.lower():
                        unit = 'm³/m³'
                    else:
                        unit = grb.units
                    
                    farm_data[key] = {
                        'value': float(value),
                        'unit': unit,
                        'name': var_name
                    }
                    
                    print(f"✅ {var_name:40s}: {value:8.2f} {unit}")
                else:
                    print(f"⚠️  {var_name:40s}: Nije pronađeno")
            except Exception as e:
                print(f"❌ {var_name:40s}: Greška - {e}")
        
        # Izračunaj brzinu vjetra ako imamo komponente
        if 'vjetar_u' in farm_data and 'vjetar_v' in farm_data:
            u = farm_data['vjetar_u']['value']
            v = farm_data['vjetar_v']['value']
            wind_speed = np.sqrt(u**2 + v**2)
            wind_direction = np.degrees(np.arctan2(v, u)) % 360
            
            farm_data['brzina_vjetra'] = {
                'value': wind_speed,
                'unit': 'm/s',
                'name': 'Wind Speed'
            }
            farm_data['smjer_vjetra'] = {
                'value': wind_direction,
                'unit': '°',
                'name': 'Wind Direction'
            }
            
            print(f"✅ {'Brzina vjetra':40s}: {wind_speed:8.2f} m/s")
            print(f"✅ {'Smjer vjetra':40s}: {wind_direction:8.1f} °")
        
        grbs.close()
        
        # ============================================================
        # 3. ANALIZA I INTERPRETACIJA ZA FARMERA
        # ============================================================
        print("\n" + "="*70)
        print("🌾 INTERPRETACIJA ZA POLJOPRIVREDU")
        print("="*70)
        
        interpret_weather_for_farming(farm_data)
        
        # ============================================================
        # 4. SAČUVAJ PODATKE
        # ============================================================
        save_farm_data(farm_data, lat, lon)
        
        return farm_data
        
    except FileNotFoundError:
        print(f"❌ Fajl nije pronađen: {grib_file}")
        return None
    except Exception as e:
        print(f"❌ Greška pri obradi: {e}")
        import traceback
        traceback.print_exc()
        return None


def process_grib_with_cfgrib(grib_file, lat, lon):
    """
    Obrađuje GRIB2 fajl koristeći cfgrib + xarray
    
    Args:
        grib_file: Putanja do GRIB2 fajla
        lat: Geografska širina farme
        lon: Geografska dužina farme
    """
    import xarray as xr
    import numpy as np
    
    print(f"\n📂 Otvaram GRIB fajl sa xarray: {grib_file}")
    print(f"📍 Lokacija: ({lat}, {lon})")
    
    farm_data = {}
    
    # GRIB fajl ima više nivoa - trebamo otvoriti svaki posebno
    levels_to_process = [
        ('surface', 'Površina (temperatura, pritisak, padavine)'),
        ('heightAboveGround', 'Visina iznad tla (temperatura 2m, vjetar 10m)'),
        ('depthBelowLandLayer', 'Dubina ispod površine (temperatura i vlažnost tla)'),
        ('atmosphere', 'Atmosfera (oblaci, precipitable water)'),
    ]
    
    print("\n" + "="*70)
    print("📊 EKSTRAKCIJA PODATAKA PO NIVOIMA")
    print("="*70)
    
    for level_type, description in levels_to_process:
        print(f"\n🔍 {description}")
        print("-" * 70)
        
        try:
            # Otvori GRIB sa filterom za specifičan nivo
            ds = xr.open_dataset(
                grib_file, 
                engine='cfgrib',
                backend_kwargs={'filter_by_keys': {'typeOfLevel': level_type}}
            )
            
            # Selektuj najbližu tačku
            # Provjeri da li postoje latitude/longitude koordinate
            if 'latitude' in ds.coords and 'longitude' in ds.coords:
                data_point = ds.sel(latitude=lat, longitude=lon, method='nearest')
            else:
                print(f"   ⚠️  Nema geo koordinata za ovaj nivo")
                ds.close()
                continue
            
            # Ekstrakcija varijabli
            for var in data_point.data_vars:
                try:
                    value = float(data_point[var].values)
                    
                    # Provjeri da li je validna vrijednost
                    if np.isnan(value) or np.isinf(value):
                        continue
                    
                    unit = data_point[var].attrs.get('units', 'N/A')
                    long_name = data_point[var].attrs.get('long_name', var)
                    
                    # Konverzije jedinica
                    if unit == 'K':
                        value = value - 273.15
                        unit = '°C'
                    elif unit == 'Pa':
                        value = value / 100
                        unit = 'hPa'
                    
                    # Mapiranje na razumljiva imena
                    var_mapping = {
                        't2m': 'temperatura_2m',
                        'u10': 'vjetar_u_10m',
                        'v10': 'vjetar_v_10m',
                        'sp': 'pritisak_povrsine',
                        'tp': 'ukupne_padavine',
                        'tcc': 'oblacnost',
                        'r2': 'vlaznost_2m',
                        'tsoil': 'temperatura_tla',
                        'soilw': 'vlaznost_tla',
                        'dswrf': 'solarna_radijacija',
                    }
                    
                    key = var_mapping.get(var, var)
                    
                    farm_data[key] = {
                        'value': value,
                        'unit': unit,
                        'name': long_name,
                        'level': level_type
                    }
                    
                    print(f"   ✅ {long_name:45s}: {value:10.2f} {unit}")
                    
                except Exception as e:
                    # Preskoči varijable koje ne mogu biti ekstraktovane
                    continue
            
            ds.close()
            
        except Exception as e:
            print(f"   ⚠️  Nije dostupno: {e}")
            continue
    
    # Izračunaj dodatne varijable
    if 'vjetar_u_10m' in farm_data and 'vjetar_v_10m' in farm_data:
        u = farm_data['vjetar_u_10m']['value']
        v = farm_data['vjetar_v_10m']['value']
        wind_speed = np.sqrt(u**2 + v**2)
        wind_direction = (np.degrees(np.arctan2(u, v)) + 180) % 360
        
        farm_data['brzina_vjetra'] = {
            'value': wind_speed,
            'unit': 'm/s',
            'name': 'Brzina vjetra',
            'level': 'calculated'
        }
        farm_data['smjer_vjetra'] = {
            'value': wind_direction,
            'unit': '°',
            'name': 'Smjer vjetra (0=sjever, 90=istok)',
            'level': 'calculated'
        }
        
        print(f"\n   ✅ {'Brzina vjetra':45s}: {wind_speed:10.2f} m/s")
        print(f"   ✅ {'Smjer vjetra':45s}: {wind_direction:10.1f} °")
    
    if not farm_data:
        print("\n❌ Nema ekstraktovanih podataka!")
        return None
    
    print("\n" + "="*70)
    print("🌾 INTERPRETACIJA ZA POLJOPRIVREDU")
    print("="*70)
    
    interpret_weather_for_farming(farm_data)
    
    # Sačuvaj podatke
    save_farm_data(farm_data, lat, lon)
    
    return farm_data


def interpret_weather_for_farming(farm_data):
    """Interpretira vremenske podatke za poljoprivrednike"""
    
    recommendations = []
    
    # Analiza temperature
    if 'temperatura_2m' in farm_data:
        temp = farm_data['temperatura_2m']['value']
        
        if temp < 0:
            recommendations.append("🥶 MRAZ! Rizik od smrzavanja usjeva.")
        elif temp < 5:
            recommendations.append("❄️  Niske temperature. Usporavanje rasta.")
        elif 15 <= temp <= 25:
            recommendations.append("🌡️  Optimalna temperatura za većinu usjeva.")
        elif temp > 30:
            recommendations.append("🔥 Visoke temperature! Povećana potreba za vodom.")
        elif temp > 35:
            recommendations.append("🔥 EKSTREMNA VRUĆINA! Toplotni stres usjeva.")
    
    # Analiza padavina
    if 'padavine' in farm_data:
        precip = farm_data['padavine']['value']
        
        if precip > 20:
            recommendations.append("☔ Značajne padavine. Provjerite drenažu.")
        elif precip > 50:
            recommendations.append("⛈️  JAKA KIŠA! Rizik od poplava i erozije.")
        elif precip < 1:
            recommendations.append("☀️  Suvo vrijeme. Razmotriti navodnjavanje.")
    
    # Analiza vjetra
    if 'brzina_vjetra' in farm_data:
        wind = farm_data['brzina_vjetra']['value']
        
        if wind > 15:
            recommendations.append("💨 JAK VJETAR! Odgodite prskanje.")
        elif wind > 25:
            recommendations.append("🌪️  OLUJA! Rizik od oštećenja usjeva.")
    
    # Analiza vlažnosti tla
    if 'vlaznost_tla' in farm_data:
        soil_moist = farm_data['vlaznost_tla']['value']
        
        if soil_moist < 0.15:
            recommendations.append("🏜️  Suvo zemljište. Potrebno navodnjavanje.")
        elif soil_moist > 0.35:
            recommendations.append("💧 Zasićeno zemljište. Izbjegavajte obradu.")
    
    # Solarna radijacija
    if 'solarna_radijacija' in farm_data:
        solar = farm_data['solarna_radijacija']['value']
        
        if solar > 800:
            recommendations.append("☀️  Odlični uslovi za fotosintezu.")
        elif solar < 200:
            recommendations.append("☁️  Oblačno. Smanjena fotosinteza.")
    
    # Ispis preporuka
    if recommendations:
        print("\n⚠️  PREPORUKE:")
        for rec in recommendations:
            print(f"   • {rec}")
    else:
        print("\n✅ Normalni vremenski uslovi.")


def save_farm_data(farm_data, lat, lon):
    """Čuva ekstraktovane podatke u JSON i CSV format"""
    import json
    import pandas as pd
    from datetime import datetime
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # JSON format
    json_file = f'farm_data_{lat}_{lon}_{timestamp}.json'
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(farm_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 JSON sačuvan: {json_file}")
    
    # CSV format
    df_data = []
    for key, value in farm_data.items():
        df_data.append({
            'varijabla': key,
            'naziv': value['name'],
            'vrijednost': value['value'],
            'jedinica': value['unit']
        })
    
    df = pd.DataFrame(df_data)
    csv_file = f'farm_data_{lat}_{lon}_{timestamp}.csv'
    df.to_csv(csv_file, index=False, encoding='utf-8')
    
    print(f"💾 CSV sačuvan: {csv_file}")


def main():
    """Glavna funkcija"""
    
    print("="*70)
    print("🌾 GRIB2 PROCESOR ZA POLJOPRIVREDU")
    print("="*70)
    
    # Provjeri dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Pronađi GRIB fajl
    grib_file = None
    
    # Provjeri u data/gfs folderu
    if os.path.exists('data/gfs'):
        files = [f for f in os.listdir('data/gfs') if f.endswith('.grib2') or 'gfs' in f]
        if files:
            grib_file = os.path.join('data/gfs', files[0])
    
    # Ako nije pronađen, traži u trenutnom direktoriju
    if not grib_file:
        files = [f for f in os.listdir('.') if f.endswith('.grib2') or 'gfs' in f]
        if files:
            grib_file = files[0]
    
    if not grib_file:
        print("\n❌ GRIB fajl nije pronađen!")
        print("   Provjeri da li je preuzet u data/gfs/ ili trenutni folder")
        sys.exit(1)
    
    print(f"\n✅ Pronađen GRIB fajl: {grib_file}")
    print(f"   Veličina: {os.path.getsize(grib_file) / (1024*1024):.1f} MB")
    
    # Unesi koordinate farme
    print("\n📍 Unesi koordinate farme:")
    print("   (Za Mostar: 43.3438, 17.8078)")
    print("   (Za Sarajevo: 43.8563, 18.4131)")
    
    try:
        lat = float(input("   Geografska širina (lat): ") or "43.3438")
        lon = float(input("   Geografska dužina (lon): ") or "17.8078")
    except ValueError:
        print("❌ Nevažeće koordinate. Koristim Mostar kao default.")
        lat, lon = 43.3438, 17.8078
    
    # Obradi GRIB fajl
    try:
        import pygrib
        farm_data = process_grib_with_pygrib(grib_file, lat, lon)
    except ImportError:
        try:
            import cfgrib
            farm_data = process_grib_with_cfgrib(grib_file, lat, lon)
        except ImportError:
            print("\n❌ Nema instaliranog GRIB procesora!")
            print("   Instaliraj: pip install pygrib")
            print("   ILI: pip install cfgrib xarray")
            sys.exit(1)
    
    if farm_data:
        print("\n" + "="*70)
        print("✅ OBRADA ZAVRŠENA USPJEŠNO!")
        print("="*70)
        print("\n💡 Sljedeći koraci:")
        print("   1. Provjeri sačuvane JSON i CSV fajlove")
        print("   2. Integriši ove podatke u svoj AI model")
        print("   3. Preuzmi satelitske snimke za NDVI analizu")
        print("   4. Kombiniraj sa podacima o tlu")


if __name__ == "__main__":
    main()