cd /home/ec2-user

# Install Git
sudo yum update -y
sudo yum install -y git

git clone https://github.com/Booss3my/football-scoreboard-maker.git

# Download the Linux Anaconda Distribution
wget https://repo.anaconda.com/archive/Anaconda3-2019.03-Linux-x86_64.sh -O ./anaconda3.sh

# Run the installer (installing without -p should automatically install into '/' (root dir))
bash ./anaconda3.sh -b -p /home/ec2-user/anaconda3
rm anaconda3.sh

# Run the conda init script to setup the shell
echo ". /home/ec2-user/anaconda3/etc/profile.d/conda.sh" >> /home/ec2-user/.bashrc
. /home/ec2-user/anaconda3/etc/profile.d/conda.sh
source /home/ec2-user/.bashrc

conda create -y --name python3


# Install requirements and run the app
exec bash
conda activate
cd football-scoreboard-maker/
pip install -r requirements.txt
python app.py