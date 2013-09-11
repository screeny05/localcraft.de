Raspberry Pi - Raspbmc mit verschlüsselter Festplatte
04. Mar 2013 16:01
HDD, Linux, Truecrypt, Raspberry Pi

Ich bin seit einer Weile in Besitz eines Raspberry Pi’s und möchte euch ein kleines HowTo zur Seite geben damit ihr euren Pi sowohl als Heimkinosystem, als auch als DLNA/UPnP Server mit einer durch Truecrypt verschlüsselten Festplatte nutzen könnt.

<!-- more -->

###Voraussetzungen
- Raspberry Pi
- SD-Karte
- Verschlüsselte Festplatte
- [Truecrypt ARM-Binaries](http://localcraft.de/wp-content/uploads/truecrypt-armhf.zip)

###Anleitung
1. Besorgt euch die aktuelle Raspbmc Version hier und folgt der Anleitung um das System auf eure SD-Karte zu installieren.
2. Verschlüsselt eure externe Festplatte mithilfe von Truecrypt. Lasst ggf. eine ca. 100MB große Partition beiseite (Auf dieser könnt ihr zB. die Portablen Windows-Binaries ablegen). Da Ich kein großer Fan von Partitionierung bin, verschlüssele Ich einfach den Rest der HDD als zweite Partition.
3. Schließt die Festplatte an den Raspberry an und startet Ihn.
4. Stellt eine Verbindung in euer Lokales Netz her und besorgt euch die IP-Adresse eures Pi’s unter Einstellungen > Systeminformationen > Netzwerk.
5. Verbindet euch via SSH auf euren Pi und befolgt die nachfolgenden Kommandos:
```bash
ssh pi@192.168.2.104
su #Passwort=raspberry
cd /sbin
wget http://localcraft.de/wp-content/uploads/truecrypt-armhf.zip
unzip truecryt-armhf.zip
rm truecrypt-armhf.zip
chmod u+x truecrypt
mkdir /media/crypt
lsblk -o NAME,LABEL #Sucht eure TrueCrypt-Partition; Bei mir: sda2
truecrypt -m=nokernelcrypto /dev/sda2 /media/crypt
```

6. Fügt eure Medienorte unter `/media/crypt` der Bibliothek hinzu und startet den DLNA/UPnP Server unter Einstellungen > Server

###Fertig!

Vielen Dank an Reinhard Seiler, für das [Tutorial zum Compilen der Binaries](http://reinhard-seiler.blogspot.de/2012/07/compile-truecrypt-on-raspberry-pi.html).
*PS:* Falls Ihr Performanceprobleme habt, probiert es mal mit [Übertakten](http://www.raspberrypi.org/archives/2008).