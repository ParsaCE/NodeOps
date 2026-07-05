data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "nodeops" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name    = "nodeops-vpc"
    Project = "NodeOps"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.nodeops.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name    = "nodeops-public-subnet"
    Project = "NodeOps"
  }
}

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.nodeops.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name    = "nodeops-private-subnet-1"
    Project = "NodeOps"
  }
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.nodeops.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name    = "nodeops-private-subnet-2"
    Project = "NodeOps"
  }
}

resource "aws_db_subnet_group" "db" {
  name        = "nodeops-db-subnet-group"
  description = "Database subnet group for NodeOps RDS"
  subnet_ids  = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name    = "nodeops-db-subnet-group"
    Project = "NodeOps"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.nodeops.id

  tags = {
    Name    = "nodeops-igw"
    Project = "NodeOps"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.nodeops.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name    = "nodeops-public-rt"
    Project = "NodeOps"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

