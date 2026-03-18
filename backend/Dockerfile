FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

COPY MaloPazarche.csproj ./
RUN dotnet restore --no-cache

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

COPY . ./

# Build the app during image build, not at container startup
RUN dotnet publish -c Release -o /app/publish

EXPOSE 5000

CMD ["bash", "-c", "dotnet ef database update && dotnet /app/publish/MaloPazarche.dll"]

