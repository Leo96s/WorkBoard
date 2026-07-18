using System.Collections.Concurrent;
using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Base genérica para repositórios em memória, com armazenamento thread-safe via ConcurrentDictionary.
    /// Centraliza as operações comuns de CRUD; cada repositório concreto adiciona apenas as suas consultas específicas.
    /// </summary>
    public abstract class InMemoryRepository<T> where T : class, IEntity
    {
        private readonly ConcurrentDictionary<Guid, T> _items = new();

        public virtual IEnumerable<T> GetAll() => _items.Values;

        public T? GetById(Guid id) => _items.TryGetValue(id, out var item) ? item : null;

        public void Add(T item) => _items[item.Id] = item;

        public void Update(T item) => _items[item.Id] = item;

        public void Delete(Guid id) => _items.TryRemove(id, out _);
    }
}
