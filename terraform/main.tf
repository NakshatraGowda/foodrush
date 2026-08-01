terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

variable "region" {
  default     = "us-east-1"
  description = "AWS Region"
}

variable "ami" {
  default     = "ami-03deb8c961063af8c"
  description = "Amazon machine image ID for ubuntu server"
}

variable "type" {
  default     = "m7i-flex.large"
  description = "Size of VM"
}

provider "aws" {
  region = var.region
}

resource "aws_instance" "foodrush" {
  ami           = var.ami
  instance_type = var.type

  key_name = "keypair-Nvirginia"

  user_data = <<-EOF
              #!/bin/bash
              apt update -y
              apt install -y docker
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu
              EOF

  tags = {
    name = "Food Rush"
  }
}
