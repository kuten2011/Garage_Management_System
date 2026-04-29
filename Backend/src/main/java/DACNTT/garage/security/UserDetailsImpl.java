package DACNTT.garage.security;

import DACNTT.garage.model.Customer;
import DACNTT.garage.model.Employee;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Object user) {
        String username, password;
        List<GrantedAuthority> authorities;

        if (user instanceof Customer customer) {
            username = customer.getEmail();
            password = customer.getMatKhau();
            authorities = List.of(new SimpleGrantedAuthority(customer.getRole().name()));
        } else if (user instanceof Employee employee) {
            username = employee.getEmail();
            password = employee.getMatKhau();
            authorities = List.of(new SimpleGrantedAuthority(employee.getRole().name()));
        } else {
            throw new RuntimeException("User type not supported");
        }

        return new UserDetailsImpl(username, password, authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return username; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}