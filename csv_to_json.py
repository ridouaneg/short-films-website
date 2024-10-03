import csv
import json
import os

def csv_to_json(csv_file_path, json_file_path):
    """
    Converts a CSV file to a JSON file.

    Args:
        csv_file_path (str): Path to the input CSV file.
        json_file_path (str): Path to the output JSON file.
    """
    data = []
    
    # Open and read the CSV file
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        # Use DictReader to map the data into a dictionary
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            # Convert fields to appropriate data types
            try:
                movie = {
                    "id": row["id"],
                    "title": row["title"],
                    #"director": row["director"],
                    #"actors": [actor.strip() for actor in row["actors"].split('|')],  # Convert to list
                    "duration": int(float(row["duration"])),
                    "country": row["country"],
                    "language": row["language"],
                    "synopsis": row["synopsis"],
                    "youtube_url": row["youtube_url"],
                    "thumbnail_url": row["thumbnail_url"],
                    "release_date": row["release_date"]  # Consider converting to date object if needed
                }
                data.append(movie)
            except ValueError as ve:
                print(f"Value error for row {row['id']}: {ve}")
            except KeyError as ke:
                print(f"Missing key {ke} in row {row}")
    
    # Write the JSON data to a file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)
    
    print(f"Successfully converted {csv_file_path} to {json_file_path}")

if __name__ == "__main__":
    # Define file paths
    current_directory = os.path.dirname(os.path.abspath(__file__))
    csv_file = os.path.join(current_directory, 'data/movies.csv')
    json_file = os.path.join(current_directory, 'data/movies.json')
    
    # Convert CSV to JSON
    csv_to_json(csv_file, json_file)
