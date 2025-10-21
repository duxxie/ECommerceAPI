public class Produto
{
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public string? Descricao { get; set; }
    public decimal Preco { get; set; }
    public int Estoque { get; set; }
    public string? Categoria { get; set; }
    public bool Ativo { get; set; }
    
    public ICollection<ItemCarrinho>? ItensCarrinho { get; set; }
    public ICollection<ItemPedido>? ItensPedido { get; set; }
}