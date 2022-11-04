#!/bin/bash
kek="$USER"
export kek

# set darkmode
echo -e "\n\nSet darkmode"
gsettings set org.gnome.desktop.interface color-scheme 'prefer-dark'


# set cz keybord layout
echo -e "\n\nSeting keybord layout"
sudo localectl set-x11-keymap cz
gsettings set org.gnome.desktop.input-sources sources "[('xkb', 'cz')]"

# gnome minimize maximize
echo -e "\n\nSeting gnome minimize and maximize buttons"
gsettings set org.gnome.desktop.wm.preferences button-layout ":minimize,maximize,close"

# update and install pamac
echo -e "\n\nInstaling pamac"
sudo sed -i "/\[multilib\]/,/Include/"'s/^#//' /etc/pacman.conf
sudo pacman -Suy --needed base-devel git
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
cd ..
sudo rm -r yay
sudo yay -Sy pamac-flatpak-gnome

# install core packages
echo -e "\n\nInstaling core packages"
sudo pacman -Sy firefox git neofetch speedtest-cli net-tools nano wget curl seahorse grub efibootmgr grub-customizer

# user interapt
echo -e "\n\nPlease Change pamac setting. Enable AUR and Flatpak"
read

# install zsh with manjaro settings
echo -e "\n\nSeting up zsh"
sudo pamac install zsh manjaro-zsh-config-git
echo "# Use powerline
USE_POWERLINE=\"true\"
# Source manjaro-zsh-configuration
if [[ -e /usr/share/zsh/manjaro-zsh-config ]]; then
  source /usr/share/zsh/manjaro-zsh-config
fi
# Use manjaro zsh prompt
if [[ -e /usr/share/zsh/manjaro-zsh-prompt ]]; then
  source /usr/share/zsh/manjaro-zsh-prompt
fi

alias nano=\"nano -c\"" > ~/.zshrc
sudo -E usermod -s $(which zsh) $kek
sudo usermod -s $(which zsh) root

# install other packages
echo -e "\n\nInstaling your packages"
sudo pamac install python-gpgme deluge discord evolution filezilla flatseal gedit gparted hplip kodi krita lollypop lutris mysql-workbench jdk-openjdk java-environment-common java-runtime-common jre-openjdk jre-openjdk-headless protonup-qt signal-desktop vlc appimagelauncher phpmyadmin mariadb mariadb-clients betterdiscordctl blobsaver-bin grub-btrfs btrfs-autosnap btrfs-assistant pnpm-bin cpu-x cura-bin dconf-editor discover-overlay dotnet-runtime dotnet-sdk emote etcher-bin google-chrome heroic-games-launcher-bin wine winetricks wine-gecko leagueoflegends-git opera minecraft-launcher nautilus-admin-git nautilus-empty-file btop nfs-utils onedrive onedrivegui-git onlyoffice-bin opera-ffmpeg-codecs php php-apache php-sqlite realvnc-vnc-server realvnc-vnc-viewer teamviewer tor torsocks vulkan-headers indicator-sound-switcher runebook-bin ventoy-bin lib32-nvidia-utils
yay -Sy dropbox spotify-adblock
rm -rf ~/.dropbox-dist
install -dm0 ~/dropbox-dist

# remove vim
echo -e "\n\nRemuving vim"
sudo pamac remove vim

# install grub theme
git clone https://github.com/Crylia/dotfiles.git
cd dotfiles/grub/
sudo cp -r * /boot/grub/
cd ..
cd ..
sudo rm -r dotfiles
sudo cp grub /etc/default/grub

# install and setup virt-manager
echo -e "\n\nInstaling virtual manager"
sudo pamac install virt-manager qemu-desktop libvirt edk2-ovmf dnsmasq iptables-nft

sudo systemctl enable libvirtd.service
sudo systemctl start libvirtd.service
sudo usermod -aG libvirt $kek

sudo sh -c 'echo -e "\n\nunix_sock_group = \"libvirt\"\nunix_sock_rw_perms = \"0770\"" >> /etc/libvirt/libvirtd.conf'

sudo -E sh -c 'echo -e "\n\nuser = \"$kek\"\ngroup = \"$kek\"" >> /etc/libvirt/qemu.conf'

sudo virsh net-autostart default


# install steam
echo -e "\n\nInstaling steam"
sudo pacman -Sy steam

# add templates
echo -e "\n\nAdding templates"
echo "#\!/bin/bash" > ~/Templates/Empty\ Bash.sh
touch ~/Templates/Empty\ text.txt
touch ~/Templates/Empty\ text.txt

# fstab
echo -e "\n\nFstab settings"
echo -e "Enter your username:"
read nasusr
echo -e "Enter your password:"
read -s naspaswd
export nasusr
export naspaswd
sudo -E sh -c 'echo -e "\n\n# My drives" >> /etc/fstab'
sudo mkdir /mnt/Nas-pi
sudo -E sh -c 'echo -e "//192.168.1.199/homes/Boubik /mnt/Nas-pi cifs username=$nasusr,password=$naspaswd,rw,uid=1000,iocharset=utf8,noperm,file_mode=0755,dir_mode=0755,users 0 0" >> /etc/fstab'
sudo mkdir /mnt/Nas-pi-celydisk
sudo -E sh -c 'echo -e "//192.168.1.199/homes /mnt/Nas-pi-celydisk cifs username=$nasusr,password=$naspaswd,rw,uid=1000,iocharset=utf8,noperm,file_mode=0755,dir_mode=0755,users 0 0" >> /etc/fstab'
sudo mkdir /mnt/Data
sudo sh -c 'echo -e "/dev/disk/by-uuid/8A3208AD32089FF5 /mnt/Data ntfs-3g rw,uid=1000,iocharset=utf8,noperm,file_mode=0755,dir_mode=0755,users 0 0" >> /etc/fstab'
sudo systemctl daemon-reload
mount -a

# copy configs
echo -e "\n\nCoping configs"
sudo cp -r files ~/
sudo -E chown -R $kek:$kek ~/files
cp -r ~/files/.config ~/
cp -r ~/files/.local ~/
sudo rm -r ~/files

# done
echo -e "\n\nEveriting is setted up you shoud restart your computer (sudo reboot)"
