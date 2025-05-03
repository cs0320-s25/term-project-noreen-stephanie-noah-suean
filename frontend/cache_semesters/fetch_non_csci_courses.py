import csv
import json
import os
import requests
import time
import ast

cookies = {
    'AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg': '179643557%7CMCIDTS%7C20146%7CMCMID%7C35620687361685143708671614397990958274%7CMCAID%7CNONE%7CMCOPTOUT-1740540362s%7CNONE%7CvVersion%7C5.5.0',
    '__zlcmid': '1QxnVZPFFXDFoMj',
    'acceptcookies': 'false',
    'fcsid': 'nosfgnrc57f8ur1ju0m0vvv5ap',
    'AMP_572175c4a8': 'JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjJhN2Y4ZDQwNS04NzE5LTRjNTQtODM4MC1iOTQ3ZDRhYTE3ZWMlMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjI3ODUxOTk5YTYwN2ZjOWI2Y2EyMDUwNjM1NWVkMTgxN2U4NjcwMDcwNzI4NTIxZjNlY2I1YzIzNTcwNjAzMzA0JTIyJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTc0NDgxNTIxNjQzMiUyQyUyMm9wdE91dCUyMiUzQWZhbHNlJTJDJTIybGFzdEV2ZW50VGltZSUyMiUzQTE3NDQ4MTU1MDUyNjQlMkMlMjJsYXN0RXZlbnRJZCUyMiUzQTQ1JTJDJTIycGFnZUNvdW50ZXIlMjIlM0E3JTdE',
    'AMP_MKTG_572175c4a8': 'JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE',
    'amplitude_id_9f6c0bb8b82021496164c672a7dc98d6_edmbrown.edu': 'eyJkZXZpY2VJZCI6IjdiNGEzZmQ2LTdjMmUtNGZjZC1iMzUxLTRjNTg1OTI1ODE5M1IiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTc0NDY2MzMxODU5MywibGFzdEV2ZW50VGltZSI6MTc0NDY2MzMyMzg5OCwiZXZlbnRJZCI6MCwiaWRlbnRpZnlJZCI6MTUsInNlcXVlbmNlTnVtYmVyIjoxNX0=',
    'IDMSESSID': '5F4F6FE688A6974A45BB5DDF724B25B1D43F9B1F2904B921CD5E4D2BB297C5AC19E573A1A6BE903A2A963193973A2681',
    'TS01b3a32b': '014b44e76b2bfffa4bf11f672f482dda08cb75db42a613534f113167d5bf454488e2a1502795632863ba48809e01be925dd9ca685b',
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.5',
    # 'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Origin': 'https://cab.brown.edu',
    'Connection': 'keep-alive',
    'Referer': 'https://cab.brown.edu/',
    # 'Cookie': 'AMCV_4D6368F454EC41940A4C98A6%40AdobeOrg=179643557%7CMCIDTS%7C20146%7CMCMID%7C35620687361685143708671614397990958274%7CMCAID%7CNONE%7CMCOPTOUT-1740540362s%7CNONE%7CvVersion%7C5.5.0; __zlcmid=1QxnVZPFFXDFoMj; acceptcookies=false; fcsid=nosfgnrc57f8ur1ju0m0vvv5ap; AMP_572175c4a8=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjJhN2Y4ZDQwNS04NzE5LTRjNTQtODM4MC1iOTQ3ZDRhYTE3ZWMlMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjI3ODUxOTk5YTYwN2ZjOWI2Y2EyMDUwNjM1NWVkMTgxN2U4NjcwMDcwNzI4NTIxZjNlY2I1YzIzNTcwNjAzMzA0JTIyJTJDJTIyc2Vzc2lvbklkJTIyJTNBMTc0NDgxNTIxNjQzMiUyQyUyMm9wdE91dCUyMiUzQWZhbHNlJTJDJTIybGFzdEV2ZW50VGltZSUyMiUzQTE3NDQ4MTU1MDUyNjQlMkMlMjJsYXN0RXZlbnRJZCUyMiUzQTQ1JTJDJTIycGFnZUNvdW50ZXIlMjIlM0E3JTdE; AMP_MKTG_572175c4a8=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwcyUzQSUyRiUyRnd3dy5nb29nbGUuY29tJTJGJTIyJTJDJTIycmVmZXJyaW5nX2RvbWFpbiUyMiUzQSUyMnd3dy5nb29nbGUuY29tJTIyJTdE; amplitude_id_9f6c0bb8b82021496164c672a7dc98d6_edmbrown.edu=eyJkZXZpY2VJZCI6IjdiNGEzZmQ2LTdjMmUtNGZjZC1iMzUxLTRjNTg1OTI1ODE5M1IiLCJ1c2VySWQiOm51bGwsIm9wdE91dCI6ZmFsc2UsInNlc3Npb25JZCI6MTc0NDY2MzMxODU5MywibGFzdEV2ZW50VGltZSI6MTc0NDY2MzMyMzg5OCwiZXZlbnRJZCI6MCwiaWRlbnRpZnlJZCI6MTUsInNlcXVlbmNlTnVtYmVyIjoxNX0=; IDMSESSID=5F4F6FE688A6974A45BB5DDF724B25B1D43F9B1F2904B921CD5E4D2BB297C5AC19E573A1A6BE903A2A963193973A2681; TS01b3a32b=014b44e76b2bfffa4bf11f672f482dda08cb75db42a613534f113167d5bf454488e2a1502795632863ba48809e01be925dd9ca685b',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'DNT': '1',
    'Sec-GPC': '1',
    'Priority': 'u=0',
    # Requests doesn't support trailers
    # 'TE': 'trailers',
}

semester_to_srcdb = {
    "Fall 21": "202110", "Winter 21": "202115", "Spring 22": "202120", "Summer 22": "202100",
    "Fall 22": "202210", "Winter 22": "202215", "Spring 23": "202220", "Summer 23": "202200",
    "Fall 23": "202310", "Winter 23": "202315", "Spring 24": "202320", "Summer 24": "202300",
    "Fall 24": "202410", "Winter 24": "202415", "Spring 25": "202420", "Summer 25": "202400",
    "Fall 25": "202510", "Winter 25": "202515", "Spring 26": "202520"
}

search_url = "https://cab.brown.edu/api/?page=fose&route=search"

input_file = "csci_prereqs.csv"
output_file = "csci_prereqs_with_non_csci.csv"
os.makedirs("cache/search_non_csci", exist_ok=True)

# === Step 1: Parse existing file and collect non-CSCI prereqs ===
non_csci_courses = set() # continuously add to this set as we find non csci courses in csv
existing_rows = []
existing_codes = set()

with open(input_file, newline='') as f:
    reader = csv.DictReader(f)
    semester_columns = [col for col in reader.fieldnames if col not in ["Course Code", "Course Name"]]

    for row in reader:
        existing_rows.append(row)
        existing_codes.add(row["Course Code"])

        for semester in semester_columns:
            raw_prereqs = row[semester].strip()
            if raw_prereqs and raw_prereqs != "[]":
                try:
                    prereq_data = ast.literal_eval(raw_prereqs)

                    prereq_list = []

                    if isinstance(prereq_data, list):
                        for item in prereq_data:
                            if isinstance(item, (set, list)):
                                prereq_list.extend(item)
                            elif isinstance(item, str):
                                prereq_list.append(item)
                    elif isinstance(prereq_data, set):
                        prereq_list = list(prereq_data)
                    elif isinstance(prereq_data, str):
                        prereq_list = [prereq_data]
                    else:
                        prereq_list = []

                except Exception:
                    print(f"[WARN] Falling back to manual parsing in {semester} for {row['Course Code']}")
                    stripped = raw_prereqs.strip("[]{}")
                    prereq_list = [p.strip(" '\"") for p in stripped.split(",") if p.strip()]

                # Now process prereqs
                for prereq in prereq_list:
                    if isinstance(prereq, str):
                        cleaned = prereq.replace("*", "").strip()
                        if cleaned and not cleaned.startswith("CSCI"):
                            non_csci_courses.add(cleaned)

print(f"✅ Found {len(non_csci_courses)} unique non-CSCI prerequisites.")

# === Step 2: Query API with caching ===
course_offerings = {}
course_titles = {}

for course in sorted(non_csci_courses):
    if course in existing_codes:
        continue

    course_offerings[course] = {}
    found_title = None

    for semester, srcdb in semester_to_srcdb.items():
        cache_file = f"cache/search_non_csci/{course}-{srcdb}.json"

        # Load from cache or fetch from API
        if os.path.exists(cache_file):
            with open(cache_file, "r") as f:
                data = json.load(f)
        else:
            payload = {
                "other": {"srcdb": srcdb},
                "criteria": [
                    {"field": "code", "value": course}, # search for that SPECIFIC course
                    {"field": "is_ind_study", "value": "N"},
                    {"field": "is_canc", "value": "N"}
                ]
            }
            try:
                print(f"[API] Fetching {course} for {semester}")
                response = requests.post(
                    search_url,
                    cookies=cookies,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
                with open(cache_file, "w") as f:
                    json.dump(data, f, indent=2)
                time.sleep(1)
            except Exception as e:
                print(f"[ERROR] {course} in {semester}: {e}")
                data = {"results": []}

        # Look for matching course code in results
        results = data.get("results", [])
        found = len(results) > 0 
        
        if found:
            for result in results:
                code = result.get("code", "").strip()
                if code == course:
                    found_title = result.get("title", "").strip()
                    course_offerings[course][semester] = True
                    break

    course_titles[course] = found_title or ""

# === Step 3: Write output with appended non-CSCI courses ===
with open(output_file, "w", newline="") as f:
    fieldnames = ["Course Code", "Course Name"] + list(semester_to_srcdb.keys())
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()

    for row in existing_rows:
        writer.writerow(row)

    for course, offerings in course_offerings.items():
        row = {
            "Course Code": course,
            "Course Name": course_titles.get(course, "")
        }
        for semester in semester_to_srcdb:
            row[semester] = "[]" if offerings.get(semester, False) else ""
        writer.writerow(row)

print(f"\n✅ Done! Output written to `{output_file}` with caching in `cache/search_non_csci/`")
