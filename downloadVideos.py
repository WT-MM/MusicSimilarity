import os
from pytube import YouTube, Search
from moviepy.video.io.VideoFileClip import VideoFileClip
from urllib.parse import quote

def format_search_query(query):
    return quote(query)

def download_youtube_video(search, save_path):
    Search(search).results[0].streams[0].download(output_path=save_path, filename="temp_video.mp4")
    return os.path.join(save_path, "temp_video.mp4")

def convert_video_to_mp3(video_path, save_path):
    # Convert video to mp3
    video_clip = VideoFileClip(video_path)
    audio_clip = video_clip.audio
    mp3_path = save_path
    audio_clip.write_audiofile(mp3_path)
    audio_clip.close()
    video_clip.close()

    return mp3_path

def main():
    with open("music.txt", 'r') as f:
        music = f.read().splitlines()

    # Create the save_path directory if it doesn't exist
    os.makedirs('music/', exist_ok=True)

    for song in music:
        search_prompt = song
        save_path = "music/" + song.replace(" ", "_")+".mp3"

        try:
            video_path = download_youtube_video(search_prompt, 'music')
            mp3_path = convert_video_to_mp3(video_path, save_path)
            print(f"MP3 file saved at: {mp3_path}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
