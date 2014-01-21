echo "> Copying executable ..."
sudo cp run.sh /usr/bin/webpagent

mkdir ~/.johnnys-webview-apps

rm -rf ~/.johnnys-webview-apps/webpagent
mkdir ~/.johnnys-webview-apps/webpagent

cp * ~/.johnnys-webview-apps/webpagent

echo "> Finished."
