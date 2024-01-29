# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Install necessary system dependencies
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx libglib2.0-0

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port your app runs on (si nécessaire)
EXPOSE 4999

# Define the command to run your app
CMD ["gunicorn", "--bind", "0.0.0.0:4999", "server:app"]
