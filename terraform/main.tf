terraform{
    required_providers {
        aws={
            source = "hashicorp/aws"
            version = "~> 3.0"
            }
        }
}

variable "region"{
    default = "ap-south-1"
    description = "AWS Region"
    }

variable "ami" {
    default = "ami-07a00cf47dbbc844c"
    description = "Amazon machine image ID for ubuntu server"
    }

variable "type" {
    default = "m7i-flex.large"
    description = "Size of VM"
    }

provider "aws" {
    region = var.region
    }

resource "aws_instance" "foodrush" {
    ami = var.ami
    instance_type = var.type

    tags = {
        name = "Food Rush"
        }
    }