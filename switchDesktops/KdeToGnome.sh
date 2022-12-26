#!/bin/bash
read -p "Install wayland? [y/n] (default=n): " wayland
if [ "$wayland" == "y" ]
then
	sudo pacman -Sy gnome gnome-extra
else
	sudo pacman -Sy gnome gnome-extra
fi
sudo systemctl disable sddm
sudo systemctl enable gdm

echo -e "\n\n"
read -p "Remove KDE? [y/n] (default=n): " kde
if [ "$kde" == "y" ]
then
	sudo pacman -Rns plasma plasma-wayland-session kde-applications
fi

echo -e "\n\nAny key to restart your pc"
sudo reboot
