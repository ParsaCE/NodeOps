output "instance_public_ip" {
  description = "The public IP of the newly provisioned EC2 instance"
  value       = aws_instance.nodeops.public_ip
}
