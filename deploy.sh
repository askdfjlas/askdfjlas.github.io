websitedeploy() {
  echo YOU\'RE DEPLOYING TO PROD - YOU SURE ABOUT THIS?
  read answer
  if [ $answer = 'y' ]
  then
    cp -rf docs/* ../cp-notes-website/
    cd ../cp-notes-website/
    git add *
    echo Commit message?
    read message
    git commit -m "$message"
    git push
  else
    echo DEPLOYENT STOPPED
  fi
}
