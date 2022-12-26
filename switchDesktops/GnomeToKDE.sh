#!/bin/bash
read -p "Install wayland? [y/n] (default=n): " wayland
if [ "$wayland" == "y" ]
then
	sudo pacman -Sy plasma plasma-wayland-session kde-applications
else
	sudo pacman -Sy plasma kde-applications
	lookandfeeltool -a org.kde.breezedark.desktop
fi
sudo systemctl disable gdm
sudo systemctl enable sddm

echo -e "\n\n"
read -p "Remove Gnome? [y/n] (default=n): " gnome
if [ "$gnome" == "y" ]
then
	sudo pacman -Rns gnome gnome-extra
fi

echo -e "\n\nAny key to restart your pc"
sudo reboot
