namespace Ecommerce.Models;

public class Carrinho
{
    public int Id { get; set; }
    public int ProdutoId { get; set; }
    public int Nome { get; set; }
    public decimal Total { get; set; }
    
    public List<ItemCarrinho>? Itens { get; set; }
}