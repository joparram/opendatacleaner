FROM python:3.8.12-buster
# Variables de entorno
env HOME="/app" \
    USERNAME="worker" \
    GROUP="root" \
    FLASK_APP="app.server.py"

USER root
EXPOSE 5000

# Set permissions and owner
RUN mkdir ${HOME} && \
    adduser --disabled-password --gecos "" --home ${HOME} --no-create-home ${USERNAME} --ingroup ${GROUP}
# Install dependencies
RUN apt-get update && \
    apt-get install -y libxml2-dev libxslt1-dev
COPY requirements /app/requirements
RUN pip install -r ${HOME}/requirements
# Copy app files
ADD app /app/app
RUN chown -R ${USERNAME}:${GROUP} ${HOME}
USER worker
WORKDIR /app
CMD ["flask", "run", "--host=0.0.0.0"]