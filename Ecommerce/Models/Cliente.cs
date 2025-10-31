namespace Ecommerce.Models;

public class Cliente
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;

    public Cliente(string Nome, string Email, string Senha)
    {
        this.Nome = Nome;
        this.Email = Email;
        this.Senha = Senha;
    }
    // Relacionamentos
    public List<Pedido>? Pedidos { get; set; }
    public Carrinho? Carrinho { get; set; }
}