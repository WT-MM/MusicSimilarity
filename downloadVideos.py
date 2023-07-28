import os
from pytube import YouTube, Search
from moviepy.video.io.VideoFileClip import VideoFileClip
from moviepy.audio.io.AudioFileClip import AudioFileClip
from urllib.parse import quote

def format_search_query(query):
    return quote(query)

def download_youtube_video(search, save_path, save_file="mm.mp4"):
    Search(search).results[0].streams.get_audio_only().download(output_path=save_path, filename=save_file)
    return os.path.join(save_path, "temp_video.mp4")

def convert_video_to_mp3(video_path, save_path):
    # Convert video to mp3
    video_clip = AudioFileClip(video_path)
    audio_clip = video_clip.audio
    mp3_path = save_path
    audio_clip.write_audiofile(mp3_path)
    audio_clip.close()
    video_clip.close()

    return mp3_path

def main():
    with open("music.txt", 'r', encoding="utf-8") as f:
        music = f.read().splitlines()

    # Create the save_path directory if it doesn't exist
    os.makedirs('music/', exist_ok=True)

    for song in music:
        search_prompt = song + " official"
        save_path = "music/" + song.replace(" ", "_")+".mp3"
        save_path = song.replace(" ", "_")+".mp3"

        try:
            video_path = download_youtube_video(search_prompt, 'music', save_file=save_path)
            #mp3_path = convert_video_to_mp3(video_path, save_path)
            print(f"MP3 file saved at: {save_path}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
