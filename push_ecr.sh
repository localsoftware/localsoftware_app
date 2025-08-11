# 1
# Retrieve the login command to use to authenticate your Docker client to your registry.
# Use the AWS CLI:
$(aws ecr get-login --no-include-email --region us-west-2)

# 2
# Build your Docker image using the following command. 
# For information on building a Docker file from scratch see the instructions here. 
# You can skip this step if your image is already built:
docker build -t lc_demo_web .

# 3
# After the build completes, tag your image so you can push the image to this repository:
docker tag lc_demo_web:

# 4
# Run the following command to push this image to your newly created AWS repository:
docker push 

