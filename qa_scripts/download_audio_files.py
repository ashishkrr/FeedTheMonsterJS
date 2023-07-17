#!/usr/bin/env python3
import requests
import sys
from pydub import AudioSegment
from urllib.parse import unquote
import os
import re
import json
import unicodedata
import subprocess
promptUrls = []
letters = []
folder_index = 0
selected_folder = sys.argv[1]
feedback_words = ['amazing', 'fantastic1', 'great1', 'amazing!']


def download_and_convert_audio(url, output_dir, feedback_audios):
    converted_url = url.replace(
        "https://raw.githubusercontent.com/curiouslearning/ftm-languagepacks/master/", "https://cdn.jsdelivr.net/gh/curiouslearning/ftm-languagepacks@master/")
    response = requests.get(converted_url)
    file_name = converted_url.split('/')[-1]
    try:
        if feedback_audios:
            feedback_words.index(unicodedata.normalize(
                "NFC", file_name.split('.')[0]))

            file_name = re.sub('[^a-zA-Z]', '', file_name.split('.')[0])+'.wav'
            output_path = os.path.join(output_dir, file_name)

        else:
            promptUrls.index(unicodedata.normalize(
                "NFC", file_name.split('.')[0]))
            file_name = unicodedata.normalize(
                "NFC", file_name)
            output_path = os.path.join(output_dir, file_name)
        downloaded_file_path = os.path.join(output_dir, file_name)
        with open(output_path, 'wb') as file:
            file.write(response.content)
        audio = AudioSegment.from_file(output_path)
        mp3_output_path = os.path.join(
            output_dir, os.path.splitext(file_name)[0] + '.mp3')
        audio.export(mp3_output_path, format='mp3')
        os.remove(downloaded_file_path)
        return mp3_output_path
    except ValueError:
        return None


def download_and_convert_folder(repo_owner, repo_name, folder_path, output_dir, feedback_audios=False):
    base_url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/contents"
    folder_path = folder_path.strip('/')
    folder_url = f"{base_url}/{folder_path}"
    try:
        response = requests.get(folder_url)
        #print("Network operation successful!")
    except requests.exceptions.RequestException as e:
        None
        #print(f"Network operation failed: {e}")
    if response.status_code == 200:
        folder_contents = response.json()
        os.makedirs(output_dir, exist_ok=True)

        for item in folder_contents:
            if item['type'] == 'file':
                file_url = item['download_url']
                converted_file_path = download_and_convert_audio(
                    unquote(file_url), output_dir, feedback_audios)
                # if converted_file_path is not None:
                #     print(
                #         f"File downloaded and converted: {converted_file_path}")
            elif item['type'] == 'dir':
                subfolder_path = f"{folder_path}/{item['name']}"
                download_and_convert_folder(
                    repo_owner, repo_name, subfolder_path, output_dir, feedback_audios)
    # else:
    #     #print(f"Failed to retrieve folder: {folder_path}")


repo_owner = 'curiouslearning'
repo_name = 'ftm-languagepacks'


folder_path = [f'{selected_folder}/sounds/letters',
               f'{selected_folder}/sounds/words']
output_directory = f'../lang/{selected_folder.lower()}/audios'


def read_json_file(file_path):
    with open(file_path, 'r') as file:
        json_data = json.load(file)
    return json_data


file_path = f'../lang/{selected_folder.lower()}/ftm_{selected_folder.lower()}.json'
json_data = read_json_file(file_path)
for level in json_data['Levels']:
    for puzzle in level['Puzzles']:
        prompt_url = puzzle['prompt']['PromptAudio']
        promptUrls.append(unicodedata.normalize(
            "NFC", prompt_url.split('/')[-1].split('.')[0]))
#print("Total required audios = ", len(set(promptUrls)))
for path in folder_path:
    download_and_convert_folder(repo_owner, repo_name,
                                path, output_directory)
items = os.listdir(output_directory)
#print('Downloading Feedback audios')
download_and_convert_folder(repo_owner, repo_name,
                            f'{selected_folder}/sounds/feedbacks', output_directory, True)
#print("Downloaded all audios")
print(set(promptUrls))