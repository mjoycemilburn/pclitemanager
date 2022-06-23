# Build script for PClite Manager app
#
# Start a terminal session for pclitemanager, highlight the content of 
# this script and press f8. 
#
# The script copies the latest build to a composite/manager folder and
# adds the content of the pclitewebapp build folder to the root ofthe
# composite folder.The composite folder  is then deployed by firebase

# The application is designed to operate from the Firebase Milburn PC Webapp project.
# This is a free Blaze project which should cover reqts more than adequately. It runs
# under the https://mpclite.web.app/ and https://mpclite.web.app/manager urls until
# we buy it a google milburnpc.com url

npm run build
ROBOCOPY build ./composite/manager /E
ROBOCOPY ../pclitewebapp/build ./composite /E
firebase deploy --only hosting