namespace Ecommerce.Models;

public class StatusEntrega
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty; // Ex: "Pendente", "Enviado", "Entregue"
    public DateTime AtualizadoEm { get; set; } = DateTime.Now;
}