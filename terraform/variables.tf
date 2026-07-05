variable "aws_region" {
  type        = string
  description = "The AWS region where resources will be created"
  default     = "us-east-1"
}

variable "instance_type" {
  type        = string
  description = "The EC2 instance type"
  default     = "t3.micro"
}

variable "ssh_key_name" {
  type        = string
  description = "The name of the SSH key pair to associate with the EC2 instance"
  default     = "NodeOps-key"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "The CIDR block allowed to SSH into the EC2 instance (restricted to your IP)"
  default     = "0.0.0.0/0"
}

variable "db_name" {
  type        = string
  description = "The name of the database to create inside RDS"
  default     = "nodeops"
}

variable "db_username" {
  type        = string
  description = "Database administrator username"
  default     = "nodeops"
}

variable "db_password" {
  type        = string
  description = "Database administrator password"
  sensitive   = true
  default     = "nodeops_secure_password_123!"
}

