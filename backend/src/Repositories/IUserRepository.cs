using MaloPazarche.Models;

namespace MaloPazarche.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByEmailOrUsernameAsync(string emailOrUsername);
        Task CreateAsync(User user);
        Task UpdateAsync(User user);
        Task SaveChangesAsync();
    }
}
