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
yay -Sy pamac-flatpak-gnome

# install core packages
echo -e "\n\nInstaling core packages"
sudo pacman -Sy firefox git neofetch speedtest-cli net-tools nano wget curl seahorse grub efibootmgr grub-customizer grub-btrfs
yay -Sy update-grub

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
sudo pamac install lib32-giflib lib32-libpng lib32-libldap lib32-gnutls lib32-mpg123 lib32-openal lib32-v4l-utils lib32-libpulse alsa-plugins lib32-alsa-plugins lib32-alsa-lib lib32-libjpeg-turbo lib32-libxcomposite lib32-libxinerama lib32-opencl-icd-loader lib32-libxslt lib32-gst-plugins-base-libs vkd3d lib32-vkd3d lib32-sdl2 cups samba dosbox aspnet-targeting-pack gtk2 highlight evolution-spamassassin evolution-bogofilter afpfs-ng python-pybluez java-rhino gedit-plugins mtools gpart nilfs-utils udftools reiserfsprogs ntfs-3g exfatprogs f2fs-tools jfsutils galera judy perl-dbd-mariadb python-mysqlclient poppler-qt5 python-pyqt5 kseexpr kimageformats libmypaint krita-plugin-gmic libjxl lib32-opencl-nvidia gamemode innoextract lib32-gamemode lib32-vulkan-icd-loader xorg-xgamma snapper zenity libdvdcss kwallet libva-vdpau-driver libva-intel-driver vcdimager gnu-free-fonts ttf-dejavu lua52-socket libtiger sdl_image libsamplerate lirc libgoom2 projectm aribb24 aribb25 easytag gst-libav gst-plugins-ugly kid3-qt youtube-dl lttng-ust2.12 xsane python-pillow python-reportlab rpcbind libvirt-storage-gluster libvirt-storage-iscsi-direct openbsd-netcat dmidecode radvd qemu-emulators-full open-iscsi swtpm qemu-audio-alsa qemu-audio-dbus qemu-audio-jack qemu-audio-oss qemu-audio-pa qemu-audio-sdl qemu-audio-spice qemu-block-curl qemu-block-dmg qemu-block-gluster qemu-block-iscsi qemu-block-nfs qemu-block-ssh qemu-chardev-baum qemu-chardev-spice qemu-docs qemu-hw-display-qxl qemu-hw-display-virtio-gpu-gl emu-hw-display-virtio-gpu qemu-hw-display-virtio-gpu-pci qemu-hw-display-virtio-gpu-pci-gl qemu-hw-display-virtio-vga qemu-hw-display-virtio-vga-gl qemu-hw-s390x-virtio-gpu-ccw qemu-hw-usb-host qemu-hw-usb-redirect qemu-hw-usb-smartcard qemu-img qemu-pr-helper qemu-system-aarch64 qemu-system-alpha qemu-system-arm: qemu-system-avr qemu-system-cris qemu-system-hppa qemu-system-m68k qemu-system-microblaze qemu-system-mips qemu-system-nios2 qemu-system-or1k qemu-system-ppc qemu-system-riscv qemu-system-rx qemu-system-s390x qemu-system-sh4 qemu-system-sparc qemu-system-tricore qemu-system-x86: qemu-system-xtensa qemu-tests qemu-tools qemu-ui-curses qemu-ui-dbus qemu-ui-egl-headless qemu-ui-gtk qemu-ui-opengl qemu-ui-sdl qemu-ui-spice-app qemu-ui-spice-core qemu-user qemu-user-static qemu-vhost-user-gpu qemu-virtiofsd
sudo pamac install python-gpgme deluge discord evolution filezilla flatseal gedit gparted hplip kodi krita lollypop lutris mysql-workbench jdk-openjdk java-environment-common java-runtime-common jre-openjdk jre-openjdk-headless protonup-qt signal-desktop vlc appimagelauncher phpmyadmin mariadb mariadb-clients betterdiscordctl blobsaver-bin grub-btrfs btrfs-autosnap btrfs-assistant pnpm-bin cpu-x cura-bin dconf-editor discover-overlay dotnet-runtime dotnet-sdk emote etcher-bin google-chrome heroic-games-launcher-bin wine winetricks wine-gecko leagueoflegends-git opera minecraft-launcher nautilus-admin-git nautilus-empty-file btop nfs-utils onedrive onedrivegui-git onlyoffice-bin opera-ffmpeg-codecs php php-apache php-sqlite realvnc-vnc-server realvnc-vnc-viewer teamviewer tor torsocks vulkan-headers indicator-sound-switcher runebook-bin ventoy-bin lib32-nvidia-utils
yay -Sy dropbox spotify-adblock ftba
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
sudo update-grub

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
