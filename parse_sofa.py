import requests
from bs4 import BeautifulSoup

# URL of the page to scrape
url = "https://www.sofascore.com/fr/football/match/kaya-iloilo-sydney-fc/wucsUTgb#id:12701554"  # Replace with the actual URL

# Send a GET request to fetch the page content
response = requests.get(url)
response.raise_for_status()  # Raise an error for HTTP issues

# Parse the HTML content
soup = BeautifulSoup(response.text, 'html.parser')

# Extract the scores using data-testid attributes
left_score = soup.find('span', {'data-testid': 'left_score'}).text
right_score = soup.find('span', {'data-testid': 'right_score'}).text
score = f"{left_score}-{right_score}"

# Extract the time (element with color 'sofaSingles.live' but not a score)
time = soup.find(lambda tag: tag.name == 'span' 
                 and tag.get('color') == 'sofaSingles.live' 
                 and not tag.get('data-testid')).text

# Print the results
print("Score:", score)
print("Time:", time)
