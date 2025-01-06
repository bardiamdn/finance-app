FROM nginx
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./dist/ /usr/share/nginx/html

# docker build -t finance-madanilab-1.0-img .
# docker run -d -p 3080:80 --name finance-madanilab-1.0 finance-madanilab-1.0-img